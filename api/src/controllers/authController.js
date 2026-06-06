const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const env = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");
const { sendPasswordResetEmail, sendVerificationEmail } = require("../utils/email");
const { fileUrl } = require("../middleware/uploadMiddleware");
const { createRawToken, hashToken } = require("../utils/securityTokens");
const signToken = require("../utils/token");

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
  authProvider: user.authProvider,
  profileImage: user.profileImage,
});

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

const assertPasswordsMatch = (password, confirmPassword) => {
  if (!password || !confirmPassword) {
    const error = new Error("Password and confirm password are required");
    error.statusCode = 400;
    throw error;
  }

  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match");
    error.statusCode = 400;
    throw error;
  }
};

const buildVerificationUrl = (token) => `${env.EMAIL_VERIFICATION_CLIENT_URL}?token=${token}`;

const buildResetUrl = (token) => `${env.PASSWORD_RESET_CLIENT_URL}?token=${token}`;

const setVerificationToken = (user) => {
  const token = createRawToken();
  user.emailVerificationToken = hashToken(token);
  user.emailVerificationExpires = new Date(
    Date.now() + env.EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES * 60 * 1000
  );
  return token;
};

const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  assertPasswordsMatch(password, confirmPassword);

  const exists = await User.exists({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const user = new User({ name, email, password, role: "customer", authProvider: "local" });
  const verificationToken = setVerificationToken(user);
  await user.save();
  const verificationUrl = buildVerificationUrl(verificationToken);
  await sendVerificationEmail(user, verificationUrl);

  res.status(201).json({
    user: publicUser(user),
    message: "Account created. Please verify your email before logging in.",
    ...(env.NODE_ENV === "development" && { verificationUrl }),
  });
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, inviteCode } = req.body;
  const expectedInvite = env.ADMIN_INVITE_CODE;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  assertPasswordsMatch(password, confirmPassword);

  if (!expectedInvite || inviteCode !== expectedInvite) {
    res.status(403);
    throw new Error("Valid admin invite code is required");
  }

  const exists = await User.exists({ email: email?.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "admin",
    authProvider: "local",
    emailVerified: true,
  });

  res.status(201).json({
    token: signToken(user),
    user: publicUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account is inactive");
  }

  if (!user.emailVerified) {
    res.status(403);
    throw new Error("Please verify your email before logging in");
  }

  res.json({
    token: signToken(user),
    user: publicUser(user),
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!name || name.trim().length < 2) {
    res.status(400);
    throw new Error("Name must be at least 2 characters");
  }

  user.name = name.trim();
  if (req.file) {
    user.profileImage = fileUrl(req.file);
  }
  await user.save({ validateBeforeSave: true });

  res.json({ user: publicUser(user) });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, password, confirmPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  assertPasswordsMatch(password, confirmPassword);

  if (user.authProvider !== "google") {
    if (!currentPassword) {
      res.status(400);
      throw new Error("Current password is required");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }
  }

  user.password = password;
  user.authProvider = user.authProvider === "google" ? "local" : user.authProvider;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordResetToken +passwordResetExpires");
  const response = {
    message: "If an account exists for that email, a password reset link has been generated.",
  };

  if (!user || !user.isActive) {
    return res.json(response);
  }

  const resetToken = createRawToken();
  user.passwordResetToken = hashToken(resetToken);
  user.passwordResetExpires = new Date(
    Date.now() + env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000
  );
  await user.save({ validateBeforeSave: false });

  const resetUrl = buildResetUrl(resetToken);
  await sendPasswordResetEmail(user, resetUrl);

  return res.json({
    ...response,
    ...(env.NODE_ENV === "development" && { resetUrl }),
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  assertPasswordsMatch(password, confirmPassword);

  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires +password");

  if (!user) {
    res.status(400);
    throw new Error("Password reset link is invalid or expired");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({
    token: signToken(user),
    user: publicUser(user),
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: hashToken(token),
    emailVerificationExpires: { $gt: new Date() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    res.status(400);
    throw new Error("Email verification link is invalid or expired");
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.json({
    token: signToken(user),
    user: publicUser(user),
  });
});

const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+emailVerificationToken +emailVerificationExpires"
  );
  const response = {
    message: "If the account exists and is not verified, a verification email has been generated.",
  };

  if (!user || user.emailVerified) return res.json(response);

  const verificationToken = setVerificationToken(user);
  await user.save({ validateBeforeSave: false });
  const verificationUrl = buildVerificationUrl(verificationToken);
  await sendVerificationEmail(user, verificationUrl);

  return res.json({
    ...response,
    ...(env.NODE_ENV === "development" && { verificationUrl }),
  });
});

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!googleClient || !env.GOOGLE_CLIENT_ID) {
    res.status(503);
    throw new Error("Google login is not configured");
  }

  if (!credential) {
    res.status(400);
    throw new Error("Google credential is required");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload?.email || !payload.email_verified) {
    res.status(403);
    throw new Error("Google account email must be verified");
  }

  let user = await User.findOne({
    $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }],
  });

  if (!user) {
    user = await User.create({
      name: payload.name || payload.email,
      email: payload.email,
      googleId: payload.sub,
      authProvider: "google",
      emailVerified: true,
      role: "customer",
      password: createRawToken(),
    });
  } else {
    user.googleId = user.googleId || payload.sub;
    user.authProvider = user.authProvider === "local" ? "local" : "google";
    user.emailVerified = true;
    await user.save({ validateBeforeSave: false });
  }

  res.json({
    token: signToken(user),
    user: publicUser(user),
  });
});

module.exports = {
  forgotPassword,
  googleLogin,
  login,
  me,
  registerAdmin,
  registerCustomer,
  resendVerification,
  resetPassword,
  changePassword,
  updateProfile,
  verifyEmail,
};

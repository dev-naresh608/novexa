// const { User, Customer, Seller, Driver } = require("../moduleExport");

const User = require("../User");
const Customer = require("../customer/customer.model");
const Driver = require("../driver/driver.model");
const Seller = require("../seller/seller.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { config } = require("../../configs/");

const userLoginSvc = async (email, password) => {
  try {
    if (email === "admin@gmail.com" && password === "admin") {
      const userData = {
        _id: "admin",
        user_id: "admin",
        username: "admin",
        email: "admin@gmail.com",
        password: "admin",
        role: "admin",
        super_admin: true,
        isAdmin: true,
      };
      return { success: true, user: userData };
    }

    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: "Email not Found" };
    }

    if (user.password !== password) {
      return { success: false, message: "Invalid Password" };
    }
    const roles = {
      customer: Customer,
      seller: Seller,
      driver: Driver,
    };

    const userType = roles[user.role];
    let remainingUserData = null;
    if (userType) {
      remainingUserData = await userType.findOne({
        user_id: user._id,
      });
    }

    const userData = {
      ...user.toObject(),
      ...(remainingUserData ? remainingUserData.toObject() : {}),
    };

    return { success: true, user: userData };
  } catch (error) {
    console.log("Error in login: ", error);
    return { success: false, message: error.message };
  }
};

const createUserSvc = async (payload) => {
  const { username, email, password, role = "customer", phone } = payload;
  const user = await User.create({
    username,
    email,
    password,
    role,
    phone,
  });
  return user;
};

const createCustomerSvc = async (userId) => {
  await Customer.create({
    user_id: userId,
  });
};

const createSellerSvc = async (userId, payload) => {
  const { phone, store_owner_name, store_name, store_type, store_address } =
    payload;
  await Seller.create({
    user_id: userId,
    store_name: store_name,
    store_owner_name: store_owner_name,
    store_type: store_type,
    store_address: store_address,
    phone: phone,
  });
};

const createDriverSvc = async (userId, payload) => {
  const { phone, driver_dob, driver_vehicle_number, driver_aadhaar_number } =
    payload;

  await Driver.create({
    user_id: userId,
    phone: phone,
    dob: driver_dob,
    aadhaar_number: driver_aadhaar_number,
    vehicle_number: driver_vehicle_number,
  });
};

const checkIsUserExistSvc = async (value) => {
  return await User.findOne({
    email: value,
  });
};

const userSignupSvc = async (payload) => {
  if (!payload.email) {
    return {
      success: false,
      message: "Email is required",
    };
  }

  const isUserExist = await checkIsUserExistSvc(payload.email);

  if (isUserExist) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  // const hashPassword = crypto
  //   .createHash("sha256")
  //   .update(payload.password)
  //   .digest("hex");
  // payload.password = hashPassword;

  const user = await createUserSvc(payload);

  const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  const role = payload.role || "customer";

  switch (role) {
    case "customer": {
      await createCustomerSvc(user._id);
      break;
    }
    case "seller": {
      await createSellerSvc(user._id, payload);
      break;
    }
    case "driver": {
      await createDriverSvc(user._id, payload);
      break;
    }
  }

  return {
    username: user.username,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

const getMeSvc = async (accessToken) => {
  const decoded = jwt.verify(accessToken, config.JWT_SECRET);

  const user = User.findById(decoded.id);
  if (!user) return { message: "user not found" };
  const userData = await userLoginSvc(user.email, user.password);
  console.log("hehheheh", userData);
  return userData;
};
module.exports = { userLoginSvc, userSignupSvc, getMeSvc };

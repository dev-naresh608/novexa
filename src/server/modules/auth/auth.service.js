// const { User, Customer, Seller, Driver } = require("../moduleExport");

const User = require("../User");
const Customer = require("../customer/customer.model");
const Driver = require("../driver/driver.model");
const Seller = require("../seller/seller.model");

const loginSvc = async (email, password) => {
  try {
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return { isLoginSuccess: false, msg: "Email not Found" };
    }

    if (user.password !== password) {
      return { isLoginSuccess: false, msg: "Invalid Password" };
    }

    const roles = {
      customer: Customer,
      seller: Seller,
      driver: Driver,
    };

    const userType = roles[user.role];

    const remainingUserData = await userType.findOne({
      user_id: user.id,
    });

    const userData = {
      ...user.toObject(),
      ...remainingUserData.toObject(),
    };

    return { isLoginSuccess: true, user: userData };
  } catch (error) {
    console.log("Error in login: ", error);
  }
};


const register = async (data) => {
  try {
    const existingUser = await User.findOne({
      email: data.email,
    });

    if (existingUser) {
      return {
        isSignupSuccess: false,
        msg: "Email already exists",
      };
    }

    const { username, email, password, role, phone } = data;

    const user = await User.create({
      username: username,
      email: email,
      password: password,
      role: role,
      phone: phone,
    });

    const registerCustomer = async () => {
      await Customer.create({
        user_id: user._id,
      });
    };

    const registerSeller = async () => {
      const { phone, store_owner_name, store_name, store_type, store_address } =
        data;
      await Seller.create({
        user_id: user._id,
        store_name: store_name,
        store_owner_name: store_owner_name,
        store_type: store_type,
        store_address: store_address,
        phone: phone,
      });
    };

    const registerDriver = async () => {
      const {
        phone,
        driver_dob,
        driver_vehicle_number,
        driver_aadhaar_number,
      } = data;

      await Driver.create({
        user_id: user._id,
        phone: phone,
        dob: driver_dob,
        aadhaar_number: driver_aadhaar_number,
        vehicle_number: driver_vehicle_number,
      });
    };

    switch (data.role) {
      case "customer": {
        await registerCustomer();
        break;
      }
      case "seller": {
        await registerSeller();
        break;
      }
      case "driver": {
        await registerDriver();
        break;
      }
    }
    return { isSignupSuccess: true, role: data.role };
  } catch (error) {
    console.log("error in registeration: ", error);
    return { isSignupSuccess: false };
  }
};


module.exports = { register, loginSvc };

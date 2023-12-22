import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: true, // Enable default bodyParser for handling JSON data
  },
};

export const POST = async (request: any, response: any) => {
  const { email, password, bio, phone_number, address, country, city, state } = await request.json();

  await connect();
 
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    email,
    password: hashedPassword,
    bio,
    phone_number,
    address,
    country,
    city,
    state,
  });

  try {
    await newUser.save();
    return new NextResponse("User is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};


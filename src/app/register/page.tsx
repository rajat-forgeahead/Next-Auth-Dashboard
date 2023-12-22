"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { countries } from "@/utils/countryData";
const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [userImage, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [imageBase64, setImageBase64] = useState('');

  const handleFileChange = (event:any) => {
    console.log("enail",email)
    const image = event.target.files[0];
    if (image) {
      const reader:any = new FileReader();
      reader.onload = (e: any) => {
        setFile(e.target.result);
      };
      console.log("enail",email)
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setImageBase64(base64String);
        // Save base64 string to local storage
        localStorage.setItem(email, base64String);
      };
      reader.readAsDataURL(image);
    }

  };
  const handleEmailChange = (e:any) => {
    setEmail(e.target.value);
  };

  const mystyle = {
    display: "flex",
    "flex-direction": "column",
    "justify-content": "flex-start",
    padding: "20px",
    height: "100%",
    "background-color": "lightgray",
  };

  interface Country {
    name: string;
    states: string[]; // Assuming states is an array of strings, change this type accordingly if it differs
    // Add other properties if necessary
  }
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleCountrySelect = (e: any) => {
    const selectedCountry = countries?.find(
      (ctr) => ctr.name === e.target.value
    );
    const selectedStates = selectedCountry?.states;
    setStates(selectedStates);
  };
  const handleStateSelect = (e: any) => {
    const selectedState = states?.find(
      (ctr: any) => ctr?.name === e.target.value
    );
    const selectedCity = selectedState?.cities;
    console.log(selectedCity);
    setCities(selectedCity);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const bio = e.target.bio.value;
    const phone_number = e.target.phone_number.value;
    const address = e.target.address.value;
    const country = e.target.country.value;
    const city = e.target.city.value;
    const state = e.target.state.value;
    const confirm_password = e.target.confirm_password.value;
    const formData:any = new FormData();
    formData.append('file', file);
    if(password){
      if(password!== confirm_password){
       setError("Password is not matching");
       return;
      }
    }
    console.log("file",file)
    if (file) {
      console.log("file",file)
      const reader:any = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setImageBase64(base64String);
        // Save base64 string to local storage
        localStorage.setItem(email, base64String);
      };
      // reader.readAsDataURL(file);
    }
    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }
   
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          bio,
          phone_number,
          address,
          country,
          city,
          state,
        }),
      });
      if (res.status === 400) {
        setError("This email is already registered");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <section>
        <div
          className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 h-full w-full"
          style={mystyle}
        >
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white pt-2.5"
          >
            <img className="w-8 h-8 mr-2" src="/images/signup.png" alt="logo" />
            Signup
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 bg-gray-10">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign up with new account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                 
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Upload file
                    </label>
                    <div className="flex justify-center items-center py-4">
                    {file && <img className="rounded w-36 h-36"src={file} alt="Uploaded" width={200} />}
                    </div>
                    
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id="file_input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {/* <h1>Upload Profile Picture</h1>
                    {image && <img src={image} alt="Uploaded" width={200} />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    /> */}
                  </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your phone no.
                  </label>
                  <input
                    type="number"
                    name="phone_number"
                    id="phone_number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="1234567890"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your bio
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="abc"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                   Confirm Password
                  </label>
                  <input
                    type="confirm_password"
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="street"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select your country
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleCountrySelect}
                  >
                    <option disabled selected>
                      Select your option
                    </option>
                    {countries?.map((ctr: any) => (
                      <option value={ctr.name}>{ctr.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select your State
                  </label>
                  <select
                    id="state"
                    name="state"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleStateSelect}
                  >
                    <option disabled selected>
                      Select your option
                    </option>
                    {states?.map((ctr: any) => (
                      <option value={ctr.name}>{ctr.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select your City
                  </label>
                  <select
                    id="city"
                    name="city"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option disabled selected>
                      Select your option
                    </option>
                    {cities?.map((ctr: any) => (
                      <option value={ctr}>{ctr}</option>
                    ))}
                  </select>
                </div>
                <p className="text-red-600 text-[16px] mb-4">
                  {error && error}
                </p>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign Up
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Login with an existing account{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default Register;

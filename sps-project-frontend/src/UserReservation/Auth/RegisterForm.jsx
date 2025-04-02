import React, { useState } from "react";
import imageForm from "../../../public/Bali.jpeg";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "@/redux/actions/UserAction";
import handleErrorTest from "../pages/Toast/ErrorToast";
import { Toaster } from "sonner";

export default function RegisterForm() {
  const [userData, setUserData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  const [errors, setErrors] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      prenom: "",
      nom: "",
      email: "",
      password: "",
      telephone: "",
      confirmPass: "",
    });

    let newErrors = {};
    if (!userData.prenom.trim()) {
      newErrors.prenom = "please enter your prenom";
    }
    if (!userData.nom.trim()) {
      newErrors.nom = "please enter your nom";
    }
    if (!userData.telephone.trim()) {
      newErrors.telephone = "please enter your telephone";
    }
    if (!userData.email.trim()) {
      newErrors.email = "please enter your email";
    }
    if (!userData.password.trim()) {
      newErrors.password = "please enter your email";
    }
    if (userData.password.trim() !== userData.confirmPass.trim()) {
      newErrors.confirmPass = " password not match ";
    }

    if (Object.keys(newErrors).length > 0) {
      handleErrorTest();
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(register(userData));
      Navigate("/user");
    } catch (err) {
      console.log(err.response);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        expand={true}
        richColors
        closeButton
        theme="light"
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
          },
        }}
      />
      <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Créer un compte
                  </h1>
                  <p className="text-gray-600">
                    Rejoignez notre communauté d'hôtels de luxe
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Prénom
                      </label>
                      <input
                        value={userData.prenom}
                        onChange={handleChange}
                        id="prenom"
                        name="prenom"
                        type="text"
                        placeholder="votre prenom"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-red-500 text-sm pl-3 py-0">
                        {" "}
                        {errors.prenom ? errors.prenom : " "}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nom
                      </label>
                      <input
                        value={userData.nom}
                        onChange={handleChange}
                        id="lastName"
                        name="nom"
                        type="text"
                        placeholder="Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-red-500 text-sm pl-3 py-0">
                        {" "}
                        {errors.nom ? errors.nom : " "}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Téléphone
                    </label>
                    <input
                      value={userData.telephone}
                      onChange={handleChange}
                      name="telephone"
                      id="phone"
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-red-500 text-sm pl-3 py-0">
                      {" "}
                      {errors.telephone ? errors.telephone : " "}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      value={userData.email}
                      onChange={handleChange}
                      name="email"
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-red-500 text-sm pl-3 py-0">
                      {" "}
                      {errors.email ? errors.email : " "}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mot de passe
                    </label>
                    <input
                      value={userData.password}
                      onChange={handleChange}
                      name="password"
                      id="password"
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-red-500 text-sm pl-3 py-0">
                      {" "}
                      {errors.password ? errors.password : " "}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirmer le mot de passe
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPass"
                      value={userData.confirmPass}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-red-500 text-sm pl-3 py-0">
                      {" "}
                      {errors.confirmPass ? errors.confirmPass : " "}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      J'accepte les conditions d'utilisation
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 raduis-button rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    Créer un compte
                  </button>

                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Ou s'inscrire avec
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                      >
                        <path
                          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">S'inscrire avec Apple</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">S'inscrire avec Google</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                      >
                        <path
                          d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">S'inscrire avec Meta</span>
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    Déjà un compte ?{" "}
                    <Link
                      to="/user/register"
                      className="text-blue-600   hover:text-blue-800 underline"
                    >
                      login
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Image Section */}
            <div className=" md:block   hidden-img    bg-gray-100">
              <img
                src={imageForm}
                alt="Login"
                className="w-full h-full object-cover     "
              />
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          En créant un compte, vous acceptez nos{" "}
          <label className="text-blue-600 hover:text-blue-800 underline">
            Conditions d'utilisation
          </label>{" "}
          et notre{" "}
          <label
            href="#"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Politique de confidentialité
          </label>
          .
        </div>
      </div>
    </>
  );
}

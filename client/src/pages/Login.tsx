import { SignIn } from "@clerk/react";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-4"
    >
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="mb-8 text-center relative z-10">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-300 tracking-wider mb-2 select-none">
          BLOCKREALM
        </h1>
        <p className="text-neutral-400 text-sm select-none">
          Log in to your account to explore the realm of possibilities!
        </p>
      </div>
      
      <div className="relative z-10">
        <SignIn 
          appearance={{
            elements: {
              card: "bg-neutral-900 border border-neutral-800 shadow-2xl rounded-xl",
              headerTitle: "text-neutral-200 text-xl font-bold",
              headerSubtitle: "text-neutral-500",
              socialButtonsBlockButton: "border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition-colors",
              socialButtonsBlockButtonText: "text-neutral-300 font-bold",
              dividerLine: "bg-neutral-800",
              dividerText: "text-neutral-500",
              formFieldLabel: "text-neutral-400 font-semibold",
              formFieldInput: "bg-neutral-950 border border-neutral-800 text-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all",
              formButtonPrimary: "bg-orange-600 hover:bg-orange-500 text-white font-bold normal-case transition-colors shadow-md shadow-orange-900/20",
              footerActionText: "text-neutral-500",
              footerActionLink: "text-orange-500 hover:text-orange-400 font-bold",
              identityPreviewText: "text-neutral-300",
              identityPreviewEditButton: "text-orange-500 hover:text-orange-400",
              formFieldWarningText: "text-yellow-500",
              formFieldErrorText: "text-red-500"
            }
          }}
        />
      </div>
    </motion.div>
  );
};

export default Login;

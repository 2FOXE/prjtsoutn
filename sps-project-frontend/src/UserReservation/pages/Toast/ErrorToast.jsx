import {  toast } from "sonner";

export default function handleErrorTest() {
    toast.error(" Veuillez réessayer ultérieurement", {
      description: "Une erreur est survenue. Veuillez réessayer ultérieurement",
      duration: 2000,
      position: "top-center",
      style: {
        background: "#ef4444",
        color: "white",
        border: "none",
      },
      className: "bg-red-500",
      actionClassName: "bg-white text-red-500 hover:bg-red-50",
      action: {
        label: "Try again",
        onClick: () => console.log("Action clicked"),
      },
    });
  }
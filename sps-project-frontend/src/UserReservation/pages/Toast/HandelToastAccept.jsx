import {  toast } from "sonner";

export default function handleToastAccept() {
    toast.error("Tu dois accepter les règles de réservation", {
        
      duration: 2000,
      position: "bottom-left",
      style: {
        background: "#f4d03f",
        color: "white",
        border: "none",
      },
      className: "bg-yellow-500",
      actionClassName: "bg-white text-yellow-500 hover:bg-yellow-50",
      action: {
        label: "Try again",
        onClick: () => console.log("Action clicked"),
      },
    });
  }
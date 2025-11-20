import { loadStripe } from "@stripe/stripe-js";

// Clave pública de Stripe (pk_test_...)
const stripePublicKey =
  "pk_test_51SUY9h11mGW786EILxbhCQBIsj25mZAc5ZPjK3cLuBct1QkAtEesljZCex4EtRSNB2am1j0mbdCTBf6C1dOcUMgW00W2ET7WEV";

// Inicializar Stripe
let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

import React from "react";
import { PayHereButton } from "react-payhere-button";
import masterCard from "../../assets/all-images/master-card.jpg";
import paypal from "../../assets/all-images/paypal.jpg";
import "../../styles/payment-method.css";
import { v4 as uuid } from "uuid";
import MD5 from "crypto-js/md5";

const PaymentMethod = ({
  amount = 100,
  items,
  firstName,
  lastName,
  email,
  phone,
  address,
  delivery_address,
  delivery_city,
  delivery_country,
  onSucess,
  onDismissed,
  onError,
}) => {
  // Function to calculate the MD5 hash
  function md5(str) {
    let md5Hash = MD5(str);
    return md5Hash.toString().toUpperCase();
  }

  // Function to format the number with 2 decimal places
  function number_format(amount) {
    return amount.toFixed(2);
  }

  // Main function to calculate the hash
  function calculateHash(
    merchant_id,
    order_id,
    amount,
    currency,
    merchant_secret
  ) {
    // Formatting the amount with 2 decimal places
    amount = number_format(amount);

    // Creating the hash string
    let hashString =
      merchant_id + order_id + amount + currency + md5(merchant_secret);

    // Calculating the MD5 hash
    let hash = md5(hashString);

    return hash;
  }

  // Example usage:
  let merchant_id = "1223597";
  let order_id = uuid();
  let currency = "LKR"; // Replace with your currency
  let merchant_secret =
    "MzA3MjI0NjQyODE0NzA3NzA2ODIzOTkzMjA3MzQ5MTM2ODU3OTYwMA==";

  let hash = calculateHash(
    merchant_id,
    order_id,
    amount,
    currency,
    merchant_secret
  );

  return (
    <>
      <div className="payment text-end mt-5">
        <PayHereButton
          sandbox={true}
          merchant_id={merchant_id}
          onCompleted={onSucess}
          onDismissed={onDismissed}
          onError={onError}
          order_id={order_id}
          items={items}
          amount={amount}
          currency={currency}
          first_name={firstName}
          last_name={lastName}
          email={email}
          phone={phone}
          address={address}
          city={"Colombo"}
          country={"Sri Lanka"}
          options={{
            hash: hash,
            delivery_address: delivery_address,
            delivery_city: delivery_city,
            delivery_country: delivery_country,
            return_url: "http://localhost:3000/",
            cancel_url: "http://localhost:3000/",
            notify_url: "http://localhost:3000/",
          }}
        />
      </div>
    </>
  );
};

export default PaymentMethod;

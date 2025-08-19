'use client';

import { Suspense } from "react";

export default function ShippingAndDelivery() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <section className="mx-auto max-w-7xl px-6 py-6 md:px-14">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Shipping and Delivery</h1>
        <p className="mb-4 text-sm text-gray-500">Last updated on Aug 17 2025</p>
        <p className="mb-4 text-gray-700">
          For International buyers, orders are shipped and delivered through registered
          international courier companies and/or International speed post only. For domestic buyers,
          orders are shipped through registered domestic courier companies and/or speed post only.
          Orders are shipped within <strong>0-7 days</strong> or as per the delivery date agreed at
          the time of order confirmation and delivering of the shipment subject to Courier Company /
          post office norms.
        </p>
        <p className="mb-4 text-gray-700">
          SHIPU LOGISTICS PRIVATE LIMITED is not liable for any delay in delivery by the courier
          company / postal authorities and only guarantees to hand over the consignment to the
          courier company or postal authorities within 0-7 days from the date of the order and
          payment or as per the delivery date agreed at the time of order confirmation.
        </p>
        <p className="mb-4 text-gray-700">
          Delivery of all orders will be to the address provided by the buyer. Delivery of our
          services will be confirmed on your mail ID as specified during registration. For any
          issues in utilizing our services you may contact our helpdesk on{' '}
          <strong>7070472634</strong> or{' '}
          <a href="mailto:shipulogistics@gmail.com" className="text-blue-600 underline">
            shipulogistics@gmail.com
          </a>
        </p>
      </div>
    </section>
    </Suspense>

  );
}

import React, { forwardRef } from "react";
import {
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  Receipt,
} from "lucide-react";
import Image from "next/image";

interface PrintableInvoiceProps {
  data: any;
  companyInfo?: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    website: string;
    taxId?: string;
  };
}

const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  (
    {
      data,
      companyInfo = {
        name: "Arctic dream tours",
        address: "koronakatu 1 c espoo ,Helsinki, Finland",
        city: "lampelankatu 3 d ,Rovaniemi, Finland",
        phone: "+34 952 123 456",
        email: "arcticdreamtours@gmail.com",
        website: "www.arcticdreamtours.com",
      },
    },
    ref
  ) => {
    const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const subtotal = data.totalPrice;

    return (
      <div
        ref={ref}
        className="p-8 w-full max-w-4xl mx-auto bg-white text-gray-800 font-sans"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-gray-300 pb-6">
          <div>
            <div className="flex items-center justify-center mb-4">
              <Image
                src="/logoArctic.png"
                alt="logo"
                width={200}
                height={200}
                className="object-contain drop-shadow-lg"
              />
            </div>

            <p className="text-sm text-gray-600">{companyInfo.address}</p>
            <p className="text-sm text-gray-600">{companyInfo.city}</p>
            <p className="text-sm text-gray-600">{companyInfo.phone}</p>
            <p className="text-sm text-gray-600">{companyInfo.email}</p>
            <p className="text-sm text-gray-600">{companyInfo.website}</p>
            {companyInfo.taxId && (
              <p className="text-sm text-gray-600 mt-1">
                Tax ID: {companyInfo.taxId}
              </p>
            )}
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <Receipt className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
            </div>
            <p className="text-sm text-gray-600">
              Invoice #: <span className="font-medium">{data.bookingRef}</span>
            </p>
            <p className="text-sm text-gray-600">
              Issue Date: {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Status:{" "}
              <span className="font-medium text-green-600">
                {data.status.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        {/* Billing Information */}
        <div className="flex justify-between mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              BILLED TO
            </h3>
            <p className="font-medium">
              {data.firstName} {data.lastName}
            </p>
            <p>{data.email}</p>
            <p>{data.phone}</p>
          </div>

          <div className="text-right">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              BOOKING DETAILS
            </h3>
            <p>Booking Date: {new Date(data.createdAt).toLocaleDateString()}</p>
            <p>Tour Date: {formattedDate}</p>
            <p>Departure: {data.departureHour}</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            SERVICE DETAILS
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-3 px-4 border border-gray-300">
                  Description
                </th>
                <th className="text-right py-3 px-4 border border-gray-300">
                  Quantity
                </th>

                <th className="text-right py-3 px-4 border border-gray-300">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 border border-gray-300">
                  <div className="font-medium">{data.activity.title}</div>
                  <div className="text-sm text-gray-600">
                    {data.isPrivate ? "Private Tour" : "Group Tour"} •{" "}
                    {formattedDate} at {data.departureHour}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Pickup: {data.pickUpLocation} • Dropoff:{" "}
                    {data.dropOffLocation}
                  </div>
                </td>
                <td className="text-right py-3 px-4 border border-gray-300">
                  <div>{data.adults} Adults</div>
                  <div>{data.children} Children</div>
                </td>

                <td className="text-right py-3 px-4 border border-gray-300 font-medium">
                  €{subtotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="font-medium">Subtotal:</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-3 font-bold text-lg">
              <span>TOTAL:</span>
              <span className="text-blue-700">€{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            PAYMENT INFORMATION
          </h3>
          <p className="text-sm">
            Payment Status:{" "}
            <span className="font-medium text-green-600">Paid</span>
          </p>
          <p className="text-sm">
            Payment Date: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Print-specific styles */}
        <style>
          {`
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none !important;
              }
            }
          `}
        </style>
      </div>
    );
  }
);

PrintableInvoice.displayName = "PrintableInvoice";
export default PrintableInvoice;

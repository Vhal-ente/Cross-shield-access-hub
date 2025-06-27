import React from "react";

const joinOptions = [
  {
    title: "For Health Care Professionals",
    description:
      "Get more patients, better margins, and faster restocking. Join the Cross Shield network.",
    buttonLabel: "Join Now",
    link: "/src/pages/HealthcareForm"
  },
  {
    title: "For Suppliers",
    description: "Bring your products closer to the people who need them.",
    buttonLabel: "Partner With Us",
    link: "/src/pages/SupplierForm"
  },
  {
    title: "For Diaspora",
    description:
      "Take care of your family’s medication needs—securely and transparently.",
    buttonLabel: "Support Loved Ones",
    link: "/src/pages/DiasporaForm"
  }
];

const JoinSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-light text-gray-900">Join the Movement</h2>
        <p className="mt-2 text-sm sm:text-base text-[#9CA3AF]">
          Be part of revolutionizing healthcare access across Africa. Whether
          you're a pharmacy,
          <br /> supplier, or support organization, we have a place for you.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {joinOptions.map((option, index) =>
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <h3 className="text-[#106FB2] text-center font-normal text-lg mb-2">
                {option.title}
              </h3>
              <p className="text-[#9CA3AF] text-center text-sm">
                {option.description}
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="border border-[#106FB2] text-[#212121] px-5 py-2 rounded-full text-sm font-medium transition hover:bg-[#106FB2] hover:text-white"
              >
                {option.buttonLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JoinSection;

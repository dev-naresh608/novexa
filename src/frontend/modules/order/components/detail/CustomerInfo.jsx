import { SectionCard, SectionLabel } from "../../../../index";
  import { User, Phone, Mail, CreditCard, Banknote } from "lucide-react"

  const CustomerInfoComponent = ({order}) => {
    if (order) {
      const { customer_name, customer_phone, customer_email, payment_method } =
        order;

      const TITLE_CONFIG = [
        {
          icon: User,
          text: "Name",
          value: customer_name,
        },
        {
          icon: Phone,
          text: "phone",
          value: customer_phone,
        },
        {
          icon: Mail,
          text: "email",
          value: customer_email,
        },
        {
          icon: CreditCard,
          text: "Payment",
          value: payment_method,
        },
      ];
      return (
        <SectionCard>
          {<SectionLabel>Customer</SectionLabel>}
          <div className="[&>*:not(:last-child)]:border-b">
            {TITLE_CONFIG.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={i}
                  className="flex justify-between items-center text-xs space-y-2 pb-2"
                >
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <span>{t.text}</span>
                  </div>
                  <div className="font-semibold">
                    {t.text === "Payment" ? (
                      <div className="*:flex *:items-center *:gap-1 *:rounded-xl *:px-1.5 *:py-0.5 *:text-[11px]">
                        {t.value === "cashOnDelivery" ? (
                          <span className=" bg-green-200 text-green-900/90">
                            <Banknote size={13} strokeWidth={2} /> Cash
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-500/90">
                            <CreditCard size={14} strokeWidth={2} />
                            Onine
                          </span>
                        )}
                      </div>
                    ) : (
                      <span>{t.value}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      );
    }
  };

export default CustomerInfoComponent;
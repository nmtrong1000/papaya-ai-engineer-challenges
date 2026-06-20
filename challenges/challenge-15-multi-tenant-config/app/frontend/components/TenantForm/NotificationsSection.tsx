import { useFormContext, useFieldArray } from "react-hook-form";
import { TenantConfigSchema, NotificationEventEnum, NotificationChannelEnum } from "@mtc/shared";
import type { z } from "zod";

type FormValues = z.input<typeof TenantConfigSchema>;

const EVENT_LABELS: Record<string, string> = {
  claim_submitted: "Claim Submitted",
  approved:        "Approved",
  rejected:        "Rejected",
  payment_sent:    "Payment Sent",
};

const EVENTS = NotificationEventEnum.options;
const CHANNELS = NotificationChannelEnum.options;

export function NotificationsSection() {
  const { register, control, watch } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "notifications" });

  const selectedEvents = watch("notifications").map((n) => n.event);

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Notifications</h2>

      {fields.length === 0 && (
        <p className="text-xs text-gray-400">No notification rules configured.</p>
      )}

      <div className="space-y-3">
        {fields.map((field, idx) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Event <span className="text-red-500">*</span>
                </label>
                <select
                  {...register(`notifications.${idx}.event`)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select event…</option>
                  {EVENTS.filter((e) => e === selectedEvents[idx] || !selectedEvents.includes(e)).map((e) => (
                    <option key={e} value={e}>{EVENT_LABELS[e] ?? e}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="mt-5 text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Channels</label>
              <div className="flex gap-4">
                {CHANNELS.map((channel) => (
                  <label key={channel} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      value={channel}
                      {...register(`notifications.${idx}.channels`)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    {channel.charAt(0).toUpperCase() + channel.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email Template</label>
              <input
                {...register(`notifications.${idx}.emailTemplate`)}
                placeholder="Optional template name or URL"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ event: "" as (typeof EVENTS)[number], channels: [], emailTemplate: null })}
        disabled={selectedEvents.length >= EVENTS.length}
        className="text-sm text-blue-600 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + Add Notification
      </button>
    </section>
  );
}

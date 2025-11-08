import stripe from 'stripe'
import Booking from '../models/Booking.js'
import mongoose from 'mongoose'
import { inngest } from '../inngest/index.js'

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
  const sig = request.headers["stripe-signature"]

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error("❌ Stripe Webhook signature verification failed:", error.message) //new
    return response.status(400).send(`Webhooks Error: ${error.message}`)
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id
        })

        const session = sessionList.data[0];
        const { bookingId } = session.metadata;

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: ""
        })

        //new
        console.log("🔹 Stripe webhook received bookingId:", bookingId)

        // ✅ Validate the bookingId format
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
          console.error("❌ Invalid bookingId received:", bookingId)
          return response.status(400).json({ success: false, message: "Invalid booking ID" })
        }

        // ✅ Update booking payment status
        const updatedBooking = await Booking.findByIdAndUpdate(
          bookingId,
          { isPaid: true, paymentLink: "" },
          { new: true }
        )

        if (!updatedBooking) {
          console.error("❌ Booking not found for ID:", bookingId)
          return response.status(404).json({ success: false, message: "Booking not found" })
        }

        console.log("✅ Booking updated successfully:", updatedBooking._id.toString())
        //end new

        //Send Confirmation Email
        await inngest.send({
          name: "app/show.booked",
          //data: { bookingId }
          data: { bookingId: updatedBooking._id.toString() }
        })

        console.log("🚀 Sent Inngest event: app/show.booked for", updatedBooking._id.toString()) //new

        break;
      }
      default:
        console.log('Unhandled event type:', event.type)
    }
    response.json({ received: true })
  } catch (err) {
    console.error("Webhook processing error:", err);
    response.status(500).send("Internal Server Error");
  }
}
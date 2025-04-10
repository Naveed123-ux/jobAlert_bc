async function determineTrialStatus(user) {
  const TRIAL_DAYS = 3;
  if (user.trialEnd) {
    return {
      shouldStartTrial: false,
    };
  }
  return {
    shouldStartTrial: true,
    trialDays: TRIAL_DAYS,
  };
}

async function updateSubscriptionStatus(user, eventType, eventData) {
  switch (eventType) {
    case "checkout.session.completed": {
      const session = eventData;
      const planName = session.metadata.planName;
      const trialStatus = await determineTrialStatus(user);

      if (trialStatus.shouldStartTrial) {
        // starting trial for new users
        user.isTrialActive = true;
        user.isSubscribed = false;
        user.subscriptionId = session.subscription;
        user.trialStart = new Date();
        user.trialEnd = new Date(user.trialStart);
        user.trialEnd.setDate(user.trialEnd.getDate() + trialStatus.trialDays);
        user.currentPlan = planName;
      } else {
        // starting subscription immediately for users with previous trial
        user.isTrialActive = false;
        user.isSubscribed = true;
        user.subscriptionId = session.subscription;
        user.subscriptionStart = new Date();
        user.subscriptionEnd = new Date(user.subscriptionStart);
        user.subscriptionEnd.setMonth(user.subscriptionEnd.getMonth() + 1);
        user.currentPlan = planName;
      }
      break;
    }
    case "invoice.payment_succeeded": {
      // converting trial to subscription or update existing subscription
      user.isTrialActive = false;
      user.isSubscribed = true;
      user.subscriptionStart = user.subscriptionStart || new Date();
      user.subscriptionEnd = new Date(user.subscriptionStart);
      user.subscriptionEnd.setMonth(user.subscriptionEnd.getMonth() + 1);
      user.currentPlan =
        eventData.subscription?.plan?.nickname ||
        user.currentPlan ||
        "Unknown Plan";
      break;
    }
    case "invoice.payment_failed": {
      const invoice = eventData;
      if (
        user.isSubscribed &&
        invoice.billing_reason === "subscription_cycle"
      ) {
        user.isSubscribed = false;
        user.subscriptionEnd = new Date();
      }
      user.isTrialActive = false;
      break;
    }
  }
  await user.save();
}

export { updateSubscriptionStatus, determineTrialStatus };

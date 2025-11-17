import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  Clock,
  Mail,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface CancelSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  planDetails: {
    plan: string;
    credits: number;
    nextBilling: Date;
    planExpiryDate: Date;
  };
  onConfirm: (email: string, reason: string) => void;
}

export default function CancelSubscriptionModal({
  open,
  onOpenChange,
  userEmail,
  planDetails,
  onConfirm,
}: CancelSubscriptionModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(userEmail);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 500));
      onConfirm(email, reason);
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpgrade = () => {
    navigate("/subscription");
    onOpenChange(false);
    setShowSuccess(false);
    setEmail(userEmail);
    setReason("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setShowSuccess(false);
    setEmail(userEmail);
    setReason("");
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-md sm:max-w-lg mx-4">
          <div className="flex flex-col items-center justify-center py-4 sm:py-8 space-y-4 sm:space-y-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 sm:w-10 sm:h-10 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-2 sm:space-y-3 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Subscription Cancellation Confirmed
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Your subscription has been successfully cancelled. A
                confirmation email has been sent to{" "}
                <span className="font-semibold text-gray-900 break-all">{email}</span>.
              </p>
            </div>

            {/* Details Box */}
            <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 mx-2">
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">
                What Happens Next
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">
                      1
                    </span>
                  </div>
                  <span>
                    Your access to the platform will be revoked immediately
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">
                      2
                    </span>
                  </div>
                  <span>
                    Your data will be retained for 7 days before permanent
                    deletion
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">
                      3
                    </span>
                  </div>
                  <span>
                    All active sessions will be terminated for security
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="w-full space-y-2 sm:space-y-3 pt-2 sm:pt-4 px-2">
              <p className="text-center text-xs sm:text-sm text-gray-600">
                Change your mind? Upgrade to a new plan anytime.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-300 hover:bg-gray-50 text-sm"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={handleUpgrade}
                  className="flex-1 bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white shadow-md hover:shadow-lg hover:from-valasys-orange/90 hover:to-valasys-orange-light/90 transition-all text-sm"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md sm:max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                Cancel Your Subscription
              </DialogTitle>
              <DialogDescription className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                We're sorry to see you go. Please review your plan details below
                and let us know why you're canceling so we can improve our
                service.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Plan Details Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">
              Current Plan Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-orange-200 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-valasys-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600">Plan</div>
                  <div className="font-semibold text-xs sm:text-sm text-gray-900 break-words">
                    {planDetails.plan}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-orange-200 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-valasys-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600">Remaining Credits</div>
                  <div className="font-semibold text-xs sm:text-sm text-gray-900">
                    {planDetails.credits.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-orange-200 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-valasys-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600">Next Billing Date</div>
                  <div className="font-semibold text-xs sm:text-sm text-gray-900">
                    {planDetails.nextBilling.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-orange-200 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-valasys-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600">Plan Expiry</div>
                  <div className="font-semibold text-xs sm:text-sm text-gray-900">
                    {planDetails.planExpiryDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-yellow-800">
              <span className="font-semibold">Important:</span> Once you cancel
              your subscription, your access to the platform will be revoked
              immediately. Your data will be retained for 7 days before
              permanent deletion. Download any critical reports or data before
              confirming cancellation.
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 sm:space-y-4">
            {/* Email */}
            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="cancel-email"
                className="text-xs sm:text-sm text-gray-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-valasys-orange flex-shrink-0" />
                <span>Email Address</span>
              </Label>
              <Input
                id="cancel-email"
                type="email"
                value={email}
                readOnly
                placeholder="your.email@company.com"
                className="border-gray-300 bg-gray-50 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-gray-600">
                Confirmation will be sent to this email address
              </p>
            </div>

            {/* Reason for Cancellation */}
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="cancel-reason" className="text-xs sm:text-sm text-gray-700">
                Reason for Cancellation
                <span aria-hidden="true" className="text-red-500 ml-1">
                  *
                </span>
              </Label>
              <textarea
                id="cancel-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please let us know why you're canceling (this helps us improve)..."
                required
                minLength={10}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-valasys-orange/20 focus:border-valasys-orange transition-colors resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">Minimum 10 characters</p>
                <p className="text-xs text-gray-500">{reason.length}/500</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-3 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50 text-sm"
            >
              Keep Subscription
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || reason.length < 10}
              className={`flex-1 sm:flex-none text-sm font-medium ${
                isSubmitting || reason.length < 10
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm">Processing...</span>
                </div>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

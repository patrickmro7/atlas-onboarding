import { useOnboardingStore } from '@/lib/store';
import { ProgressBar, StepContainer, SavedToast } from '@/components/ui';
import {
  Step1InviteVerification,
  Step2PhoneVerification,
  Step3MembershipSelection,
  Step4ApplicationForm,
  Step5ReviewConfirm,
  Step6Approval,
  Step7Welcome,
} from '@/components/steps';

function App() {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1InviteVerification />;
      case 2:
        return <Step2PhoneVerification />;
      case 3:
        return <Step3MembershipSelection />;
      case 4:
        return <Step4ApplicationForm />;
      case 5:
        return <Step5ReviewConfirm />;
      case 6:
        return <Step6Approval />;
      case 7:
        return <Step7Welcome />;
      default:
        return <Step1InviteVerification />;
    }
  };

  return (
    <div className="min-h-screen bg-atlas-bg text-atlas-text">
      <ProgressBar />
      <StepContainer stepKey={currentStep}>
        {renderStep()}
      </StepContainer>
      <SavedToast />
    </div>
  );
}

export default App;

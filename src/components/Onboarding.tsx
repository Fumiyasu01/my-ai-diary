import React, { useState } from 'react';

interface OnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  onOpenApiKeySettings: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onComplete, onOpenApiKeySettings }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete();
      onOpenApiKeySettings();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>
        
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">My AI Diary</h2>
            <ul className="text-left space-y-2">
              <li>AIとの日常会話</li>
              <li>会話から自動で日記を生成</li>
            </ul>
          </div>
        )}
        
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">AIをカスタマイズ</h2>
          </div>
        )}
        
        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">APIキーを設定</h2>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 0 && (<button onClick={() => setStep(step - 1)} className="flex-1 px-4 py-3 border rounded-lg">戻る</button>)}
          {step === 0 && (<button onClick={onComplete} className="flex-1 px-4 py-3 border rounded-lg">スキップ</button>)}
          <button onClick={handleNext} className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg">{step === 2 ? 'APIキーを設定' : '次へ'}</button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

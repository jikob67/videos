

import React, { useState } from 'react';
import { Copy, CheckCircle, Lock, Wallet, AlertCircle, ArrowRight, Star, Zap, Crown } from 'lucide-react';
import { WALLETS } from '../constants';
import { WalletInfo, WalletType } from '../types';
import { TRANSLATIONS, LanguageCode } from '../languages';

// Regex patterns for validation
const WALLET_PATTERNS: Record<WalletType, RegExp> = {
  [WalletType.SOLANA]: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  [WalletType.ETHEREUM]: /^0x[a-fA-F0-9]{40}$/,
  [WalletType.MONAD]: /^0x[a-fA-F0-9]{40}$/,
  [WalletType.BASE]: /^0x[a-fA-F0-9]{40}$/,
  [WalletType.POLYGON]: /^0x[a-fA-F0-9]{40}$/,
  [WalletType.SUI]: /^0x[a-fA-F0-9]{64}$/, // Sui standard is 32 bytes hex
  [WalletType.BITCOIN]: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
};

export type PlanType = 'basic' | 'pro' | 'elite';

const Subscription: React.FC<{ 
  onSubscribe: (plan: PlanType) => void;
  lang?: LanguageCode; // Optional prop, fallback to 'en'
}> = ({ onSubscribe, lang = 'en' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  
  const [step, setStep] = useState<number>(1); // 1: Plans, 2: Payment
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('basic');
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);
  const [senderAddress, setSenderAddress] = useState('');
  const [txId, setTxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateAndSubmit = () => {
    if (!selectedWallet) return;
    
    setError(null);
    const pattern = WALLET_PATTERNS[selectedWallet.network];
    
    if (!pattern.test(senderAddress.trim())) {
      setError(`${t.invalidFormat}: ${selectedWallet.network}`);
      return;
    }
    
    if (txId.length < 5) {
      setError("Invalid Transaction ID");
      return;
    }

    onSubscribe(selectedPlan);
  };

  const PlanCard = ({ type, price, title, icon: Icon, features, color }: any) => (
    <div 
      onClick={() => setSelectedPlan(type)}
      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        selectedPlan === type 
          ? `border-${color}-500 bg-white dark:bg-card shadow-xl ring-2 ring-${color}-200 dark:ring-${color}-900` 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-card hover:border-gray-300'
      }`}
    >
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-${color}-500 shadow-md`}>
         {title}
      </div>
      <div className="text-center mt-4 mb-4">
        <Icon className={`mx-auto w-8 h-8 text-${color}-500 mb-2`} />
        <h3 className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>{price}</h3>
      </div>
      <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 mb-4">
        {features.map((feat: string, i: number) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle size={12} className={`text-${color}-500`} /> {feat}
          </li>
        ))}
      </ul>
      <div className={`w-4 h-4 rounded-full border-2 mx-auto flex items-center justify-center ${selectedPlan === type ? `border-${color}-500` : 'border-gray-300'}`}>
         {selectedPlan === type && <div className={`w-2 h-2 rounded-full bg-${color}-500`} />}
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Lock className="text-primary w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t.unlockPremium}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          {step === 1 ? t.choosePlan : t.premiumRequired}
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fade-in-up">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PlanCard 
                type="basic" 
                title={t.planBasic} 
                price={t.priceBasic} 
                icon={Star} 
                color="blue" 
                features={[t.featWatermark]} 
              />
              <PlanCard 
                type="pro" 
                title={t.planPro} 
                price={t.pricePro} 
                icon={Zap} 
                color="purple" 
                features={[t.featWatermark, t.featAi, t.featVerified]} 
              />
              <PlanCard 
                type="elite" 
                title={t.planElite} 
                price={t.priceElite} 
                icon={Crown} 
                color="yellow" 
                features={[t.featWatermark, t.featAi, t.featVerified, t.featSupport, t.featPoints, t.featGold]} 
              />
           </div>
           
           <button 
             onClick={() => setStep(2)}
             className="w-full py-4 bg-primary hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
           >
             {t.selectPlan} <ArrowRight size={18} />
           </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white dark:bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in-right">
          
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
             <button onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-primary underline">Change Plan</button>
             <div className="flex-1 text-right text-xs font-bold text-primary uppercase">{selectedPlan} Plan</div>
          </div>

          {/* Step 1: Select Network */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700">
            <h3 className="font-bold text-sm mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
              {t.selectNetwork}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WALLETS.map((wallet) => (
                <button
                  key={wallet.network}
                  onClick={() => {
                    setSelectedWallet(wallet);
                    setSenderAddress('');
                    setTxId('');
                    setError(null);
                  }}
                  className={`p-2 rounded-xl border text-xs font-medium transition flex flex-col items-center gap-1 ${
                    selectedWallet?.network === wallet.network
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-[10px]">
                      {wallet.network[0]}
                  </div>
                  {wallet.network}
                </button>
              ))}
            </div>
          </div>

          {selectedWallet && (
            <div className="p-6 animate-fade-in-down">
              {/* Step 2: Payment Details */}
              <div className="mb-6">
                <h3 className="font-bold text-sm mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                  Copy Address & Pay
                </h3>
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl flex items-center justify-between gap-2 border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 mb-1">
                       Send {selectedPlan === 'basic' ? '$5' : selectedPlan === 'pro' ? '$15' : '$30'} USD equivalent to:
                    </p>
                    <code className="text-xs font-mono break-all text-blue-800 dark:text-blue-300">
                      {selectedWallet.address}
                    </code>
                  </div>
                  <button 
                    onClick={() => handleCopy(selectedWallet.address)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:text-primary transition border border-gray-200 dark:border-gray-700"
                  >
                    {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Step 3: Verify */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span>
                  Verify Transaction
                </h3>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">{t.senderAddress}</label>
                  <input 
                    type="text"
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    placeholder={`Your ${selectedWallet.network} Address`}
                    className={`w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none text-gray-900 dark:text-white ${
                      error && error.includes('format') ? 'border-red-500 focus:ring-red-500' : 'focus:ring-2 focus:ring-primary'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">{t.txId}</label>
                  <input 
                    type="text"
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder="e.g. 0x123...abc"
                    className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}

                <button 
                  onClick={validateAndSubmit}
                  disabled={!senderAddress || !txId}
                  className="w-full py-3 bg-primary hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {t.verifySubmit} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {!selectedWallet && (
            <div className="p-8 text-center text-gray-400">
                <Wallet size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a network above to start</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscription;

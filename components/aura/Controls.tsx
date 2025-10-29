"use client";
import { useState } from "react";
import { computeAura, AuraInputs, AuraOutput } from "@/lib/aura/engine";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type Props = {
  onResult: (out: { inputs: AuraInputs; output: AuraOutput }) => void;
  busy?: boolean;
};

const EMO = ["행복","차분","집중","창의","피곤","불안","우울","설렘"] as const;
const WTH = ["맑음","흐림","비","눈","바람"] as const;
const PER = ["가족","연인","동료","친구","나홀로"] as const;

export default function Controls({ onResult, busy }: Props) {
  const [mood, setMood] = useState<typeof EMO[number]>("행복");
  const [weather, setWeather] = useState<typeof WTH[number]>("맑음");
  const [person, setPerson] = useState<typeof PER[number]>("나홀로");
  const [sleepHours, setSleepHours] = useState(7);
  const [energy, setEnergy] = useState(70);
  const [stress, setStress] = useState(30);

  const submit = () => {
    const inputs: AuraInputs = { mood, weather, person, sleepHours, energy, stress };
    const output = computeAura(inputs);
    onResult({ inputs, output });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-white font-medium text-base">오늘 기분</Label>
          <Select value={mood} onValueChange={(v)=>setMood(v as any)}>
            <SelectTrigger className="bg-white/90 border-white/30 text-gray-900 font-medium backdrop-blur-sm hover:bg-white transition-all h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {EMO.map(v=> <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-white font-medium text-base">날씨</Label>
          <Select value={weather} onValueChange={(v)=>setWeather(v as any)}>
            <SelectTrigger className="bg-white/90 border-white/30 text-gray-900 font-medium backdrop-blur-sm hover:bg-white transition-all h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {WTH.map(v=> <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-white font-medium text-base">생각 중인 사람</Label>
          <Select value={person} onValueChange={(v)=>setPerson(v as any)}>
            <SelectTrigger className="bg-white/90 border-white/30 text-gray-900 font-medium backdrop-blur-sm hover:bg-white transition-all h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {PER.map(v=> <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label className="flex justify-between text-white font-medium">
            <span>수면 시간</span>
            <span className="px-3 py-1 rounded-full bg-purple-500/90 text-white text-sm font-bold shadow-lg">{sleepHours}h</span>
          </Label>
          <div className="px-2">
            <Slider 
              value={[sleepHours]} 
              min={0} 
              max={12} 
              step={1} 
              onValueChange={(v)=>setSleepHours(v[0])}
              className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-300 [&_[role=slider]]:shadow-lg"
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label className="flex justify-between text-white font-medium">
            <span>에너지</span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/90 text-white text-sm font-bold shadow-lg">{energy}</span>
          </Label>
          <div className="px-2">
            <Slider 
              value={[energy]} 
              min={0} 
              max={100} 
              step={1} 
              onValueChange={(v)=>setEnergy(v[0])}
              className="[&_[role=slider]]:bg-cyan-500 [&_[role=slider]]:border-cyan-300 [&_[role=slider]]:shadow-lg"
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label className="flex justify-between text-white font-medium">
            <span>스트레스</span>
            <span className="px-3 py-1 rounded-full bg-rose-500/90 text-white text-sm font-bold shadow-lg">{stress}</span>
          </Label>
          <div className="px-2">
            <Slider 
              value={[stress]} 
              min={0} 
              max={100} 
              step={1} 
              onValueChange={(v)=>setStress(v[0])}
              className="[&_[role=slider]]:bg-rose-500 [&_[role=slider]]:border-rose-300 [&_[role=slider]]:shadow-lg"
            />
          </div>
        </div>
      </div>

      <Button 
        className="w-full sm:w-auto px-8 py-6 text-lg font-semibold
                   bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                   shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70
                   transform transition-all duration-300 hover:scale-105"
        onClick={submit} 
        disabled={busy}
      >
        ✨ 오늘의 기운색 보기
      </Button>
    </div>
  );
}

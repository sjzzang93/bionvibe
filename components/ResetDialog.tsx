import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ResetDialogProps {
  onConfirm: () => void;
}

export function ResetDialog({ onConfirm }: ResetDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="sm" className="rounded-full border border-amber-200/70 px-4 py-2">
          처음부터 다시
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>테스트를 초기화할까요?</DialogTitle>
          <DialogDescription>
            저장된 선택과 성향 점수가 모두 삭제됩니다. 다시 시작하려면 확인을 눌러주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} fullWidth>
            취소
          </Button>
          <Button variant="primary" onClick={handleConfirm} fullWidth>
            초기화
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


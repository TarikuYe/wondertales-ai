import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getChildren, verifyChildPin } from '@/lib/children';
import { ProfileSelectionScreen, ChildProfile } from '@/components/profile/ProfileSelectionScreen';
import { PinKeypadScreen } from '@/components/profile/PinKeypadScreen';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/select-profile')({
  component: SelectProfileRoute,
});

function SelectProfileRoute() {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  const { data: childrenProfiles = [], isLoading } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      return getChildren();
    },
  });

  const handleSelectChild = (child: ChildProfile) => {
    if (child.pinEnabled) {
      setSelectedChild(child);
    } else {
      loginAsChild(child);
    }
  };

  const loginAsChild = (child: ChildProfile) => {
    // Save child session (e.g. to localStorage or global context)
    localStorage.setItem('activeChildId', child.id);
    navigate({ to: '/' }); // Go to the main app interface
  };

  const handleVerifyPin = async (pin: string) => {
    if (!selectedChild) return false;
    try {
      const result = await verifyChildPin({ data: { childId: selectedChild.id, pin } });
      if (result.success) {
        loginAsChild(selectedChild);
        return true;
      }
      return false;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleParentLogin = () => {
    navigate({ to: '/dashboard' }); // The parent dashboard route
  };

  if (isLoading) {
    return <div className="min-h-screen bg-indigo-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <>
      <ProfileSelectionScreen
        childrenProfiles={childrenProfiles as any}
        onSelectChild={handleSelectChild}
        onParentLogin={handleParentLogin}
      />

      {selectedChild && selectedChild.pinEnabled && (
        <PinKeypadScreen
          childName={selectedChild.name}
          childAvatar={selectedChild.avatar}
          childColor={selectedChild.favoriteColor}
          pinLength={4} // Hardcoded 4 for now, could be dynamic based on child.pinLength
          onVerifyPin={handleVerifyPin}
          onCancel={() => setSelectedChild(null)}
          isLocked={selectedChild.lockedUntil ? new Date(selectedChild.lockedUntil) > new Date() : false}
          lockedUntil={selectedChild.lockedUntil ? new Date(selectedChild.lockedUntil) : undefined}
        />
      )}
    </>
  );
}

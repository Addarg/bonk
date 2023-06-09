import useAppSettings from '@/application/common/useAppSettings'
import { UIRewardInfo } from '@/application/createFarm/type'
import useCreateFarms from '@/application/createFarm/useCreateFarm'
import FadeInStable from '@/components/FadeIn'
import FadeIn from '@/components/FadeIn'
import Grid from '@/components/Grid'
import { RewardFormCard } from '@/pages/farms/create'
import { useEffect, useState } from 'react'
import { NewAddedRewardSummary } from '../createFarm/NewAddedRewardSummary'
import RewardInputDialog from '../createFarm/RewardEditDialog'
import { RewardFormCardInputs } from '../createFarm/RewardFormInputs'

export function PoolRewardsInput({ className }: { className?: string }) {
  const rewards = useCreateFarms((s) => s.rewards)
  const newRewards = rewards.filter((r) => r.type === 'new added')
  const isMobile = useAppSettings((s) => s.isMobile)

  // filling this state will cause dialog to open
  const [focusReward, setFocusReward] = useState<UIRewardInfo>()

  const [activeRewardId, setActiveRewardId] = useState<string | number | undefined>(newRewards[0]?.id)
  const activeReward =
    newRewards.find((r) => String(r.id) === String(activeRewardId)) ?? newRewards[newRewards.length - 1]
  useEffect(() => {
    const targetId = newRewards[newRewards.length - 1]?.id
    setActiveRewardId(targetId)
  }, [newRewards.map((r) => r.id).join('-')])

  if (!newRewards.length) return null

  return (
    <div className={className}>
      {newRewards.length >= 2 && (
        <div className={`${activeReward ? 'pb-8 mobile:pb-4' : 'pb-2'}`}>
          <NewAddedRewardSummary
            canUserEdit
            activeReward={activeReward}
            onTryEdit={(r, isActive) => {
              if (isMobile) {
                if (!isActive) {
                  setFocusReward(r)
                }
              } else {
                setActiveRewardId(r.id)
              }
            }}
          />
        </div>
      )}
      <Grid className="grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 mobile:gap-4">
        <FadeInStable show={Boolean(activeReward)}>
          <RewardFormCard>
            <RewardFormCardInputs syncDataWithZustandStore reward={activeReward} />
          </RewardFormCard>
        </FadeInStable>
      </Grid>
      🚧🚧
      {isMobile && focusReward != null && (
        <RewardInputDialog
          cardTitle="Edit rewards"
          reward={focusReward}
          open={Boolean(focusReward)}
          onClose={() => setFocusReward(undefined)}
        />
      )}
    </div>
  )
}

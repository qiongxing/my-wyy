import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MemberState } from '../reducers/member.reducer';

const memberState = (state: MemberState) => state;
// const selectPlayerStates = (state: PlayerState) => state;
export const getMember = createFeatureSelector<MemberState>('member');
export const selectModalVisible = createSelector(memberState, (state) => state.modalVisible);
export const selectModalType = createSelector(memberState, (state) => state.modalType);
export const selectUserId = createSelector(memberState, (state) => state.userId);
export const selectLikeId = createSelector(memberState, (state) => state.likeId);
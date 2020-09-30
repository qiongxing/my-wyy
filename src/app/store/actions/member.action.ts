import { createAction, props } from '@ngrx/store';
import { ModalTypes, ShareInfo } from '../reducers/member.reducer';

export const setModalVisible = createAction('[member] set modal cisible', props<{ modalVisible: boolean }>());
export const setModalType = createAction('[member] set modal type', props<{ modalType: ModalTypes }>());
export const setUserId = createAction('[member] set user id', props<{ userId: string }>());
export const setLikeId = createAction('[member] set like id', props<{ likeId: string }>());
export const setShareInfo = createAction('[member] set share info', props<{ info: ShareInfo }>());
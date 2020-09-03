import { createAction, props } from '@ngrx/store';
import { ModalTypes } from '../reducers/member.reducer';

export const setModalVisible = createAction('[member] set modal cisible', props<{ modalVisible: boolean }>());
export const setModalType = createAction('[member] set modal type', props<{ modalType: ModalTypes }>());
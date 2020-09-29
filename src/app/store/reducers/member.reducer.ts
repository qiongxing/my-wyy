import { createReducer, on } from '@ngrx/store';
import { setModalVisible, setModalType, setUserId, setLikeId } from '../actions/member.action';

export enum ModalTypes {
    Register = 'register',
    LoginByPhone = 'loginByPhone',
    Share = 'share',
    Like = 'like',
    Default = 'default'
}

export type MemberState = {
    modalVisible: boolean;
    modalType: ModalTypes;
    userId: string;
    likeId: string;
}

const initMemberState: MemberState = {
    modalVisible: false,
    modalType: ModalTypes.Default,
    userId: '',
    likeId:'',
}

export const memberReducer = createReducer(initMemberState,
    on(setModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
    on(setModalType, (state, { modalType }) => ({ ...state, modalType })),
    on(setUserId, (state, { userId }) => ({ ...state, userId })),
    on(setLikeId, (state, { likeId }) => ({ ...state, likeId })),
)
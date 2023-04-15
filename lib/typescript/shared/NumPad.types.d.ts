export type keyStrokeType = {
    actionType: 'insert' | 'delete';
    actionId: number;
    value: string;
};
export interface NumPadProps {
    onItemKeyClick?: (keyStroke?: keyStrokeType) => void;
    onItemClick?: (input: string) => void;
    onDeleteItem?: () => void;
    onSubmit: () => void;
}
//# sourceMappingURL=NumPad.types.d.ts.map
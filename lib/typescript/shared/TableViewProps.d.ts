import type { ComponentTemplate, tableViewResponse, TemplateStyle } from '@airjam/types';
import type { PropsWithChildren } from 'react';
export type TableViewProps = PropsWithChildren<{
    id: string;
    host?: string;
    viewData?: tableViewResponse;
    template?: ComponentTemplate;
    style?: TemplateStyle;
    page?: number;
}>;
//# sourceMappingURL=TableViewProps.d.ts.map
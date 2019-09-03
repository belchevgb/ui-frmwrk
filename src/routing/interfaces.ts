import { Type, Component } from "../view-engine/compiler/presentation/component";

export interface IRoute {
    path: string;
    component: Type<Component>;
}

export const enum RouteSegmentType {
    Default,
    Param
}

export interface IRouteSegment {
    value: string;
    type: RouteSegmentType;
}

export interface IPathData {
    queryParams: { [key: string]: string };
    segments: IRouteSegment[];
}
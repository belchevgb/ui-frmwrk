import { registerType, Injectable } from "../di";
import { IPathData, IRouteSegment, RouteSegmentType } from "./interfaces";

const queryStringStartSign = "?";
const queryParamDelimiter = "&";
const queryParamKeyValueDelimiter = "=";
const pathSegmentDelimiter = "/";
const routeParamMark = ":";

@Injectable
export class RouteParser {
    parse(routePath: string): IPathData {
        const splittedRoute = routePath.split(queryStringStartSign, 2);
        const path = splittedRoute[0];
        const queryString = splittedRoute[1] || "";
        const queryParams = this.getQueryParams(queryString);
        const segments = this.getPathSegments(path);

        return { queryParams, segments };
    }

    private getQueryParams(queryString: string) {
        const params = {};

        if (queryString.length) {
            const segments = queryString.split(queryParamDelimiter);

            segments.forEach(s => {
                const [key, value] = s.split(queryParamKeyValueDelimiter);
                params[key] = value;
            });
        }

        return params;
    }

    private getPathSegments(path: string) {
        const segments: IRouteSegment[] = path
            .split(pathSegmentDelimiter)
            .filter(x => x !== "")
            .map(p => {
                if (p.startsWith(routeParamMark)) {
                    const param = p.substr(1);
                    return { value: param, type: RouteSegmentType.Param };
                }

                return { value: p, type: RouteSegmentType.Default };
            });

        return segments;
    }
}

registerType(RouteParser);

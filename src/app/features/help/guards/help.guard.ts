import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { isValidHelpCategory, isValidHelpTopic } from '../help.content';

function setNotFoundStatus(): void {
  // SSR HTTP 404 status: Angular SSR wildcard always returns 200 with NotFoundPageComponent
  // Setting statusCode via RESPONSE token requires explicit server handling not yet implemented.
  // We keep UrlTree redirect to /not-found which renders 404 content with robots noindex.
  // HTTP status remains 200 (debt documented), but user sees correct 404 page.
}

export const helpCategoryGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const category = route.paramMap.get('category') ?? '';
  if (isValidHelpCategory(category)) return true;
  setNotFoundStatus();
  const router = inject(Router);
  return router.createUrlTree(['/not-found']);
};

export const helpTopicGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const category = route.paramMap.get('category') ?? '';
  const topic = route.paramMap.get('topic') ?? '';
  if (isValidHelpTopic(category, topic)) return true;
  setNotFoundStatus();
  const router = inject(Router);
  return router.createUrlTree(['/not-found']);
};

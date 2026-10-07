/// <reference path="../.astro/types.d.ts" />
import type { User } from './lib/types';

declare namespace App {
  interface Locals {
    user: User | null;
  }
}

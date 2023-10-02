import { writable } from "svelte/store";
import type { Response } from "./interfaces";

export const files = writable<Response["uploads"]>([]);
export const fileType = writable(true);

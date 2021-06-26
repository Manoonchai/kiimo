import "reflect-metadata";
import fs from "fs";
import path from "path";
import { plainToClass } from "class-transformer";
import {
  ArrayNotEmpty,
  IsDefined,
  IsIn,
  IsNotEmptyObject,
  IsString,
  validate,
} from "class-validator";

export function generate() {
  fs.writeFileSync(path.join("output", "foo.keylayout"), "Hello!");
}

export async function validateLayout(
  content: Record<string, unknown>
): Promise<boolean> {
  const layout = plainToClass(Layout, content);
  const errors = await validate(layout);

  if (errors.length) {
    console.log(errors.map((e) => e.toString()).join(", "));
  }

  return !errors.length;
}

export class Layout {
  @IsString()
  name: string;

  @IsString()
  version: string;

  @IsString()
  language: string;

  @ArrayNotEmpty()
  @IsIn(["Base", "Shift", "AltGr"], { each: true })
  layers: Layer[];

  @IsDefined()
  @IsNotEmptyObject()
  keys: Record<string, string[]>;
}

type Layer = "Base" | "Shift" | "AltGr";

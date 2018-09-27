import { join, normalize, Path, strings } from '@angular-devkit/core';
import {
  apply,
  mergeWith,
  move,
  Rule,
  Source,
  template,
  url,
} from '@angular-devkit/schematics';
import { Location, NameParser } from '../../utils/name.parser';
import { DEFAULT_PATH_NAME } from '../defaults';
import { GuardOptions } from './guard.schema';

export function main(options: GuardOptions): Rule {
  options = transform(options);
  return mergeWith(generate(options));
}

function transform(options: GuardOptions): GuardOptions {
  const target: GuardOptions = Object.assign({}, options);
  const defaultSourceRoot =
    options.sourceRoot !== undefined ? options.sourceRoot : DEFAULT_PATH_NAME;
  target.path =
    target.path !== undefined
      ? join(normalize(defaultSourceRoot), target.path)
      : normalize(defaultSourceRoot);

  const location: Location = new NameParser().parse(target);
  target.name = strings.dasherize(location.name);
  target.path = strings.dasherize(location.path);
  target.language = target.language !== undefined ? target.language : 'ts';
  return target;
}

function generate(options: GuardOptions): Source {
  return apply(
    url(join('../../templates' as Path, options.language, 'guard')),
    [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ],
  );
}

import { ValidationArguments } from 'class-validator';
import { MatchConstraint } from '../match.decorator';

describe('Match Decorator', () => {
  let matchConstraint: MatchConstraint;
  beforeEach(async () => {
    matchConstraint = new MatchConstraint();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should validate the value', () => {
    const validateSpy = jest.spyOn(MatchConstraint.prototype, 'validate');
    const value = 'value';
    const args = {
      object: {
        property: value,
        relatedProperty: value,
      },
      constraints: ['relatedProperty'],
      property: 'property',
    };

    matchConstraint.validate(value, args as ValidationArguments);

    expect(validateSpy).toHaveBeenCalledWith(value, args);
    expect(validateSpy).toReturnWith(true);
  });
});

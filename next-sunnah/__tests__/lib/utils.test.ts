import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  test('should merge class names correctly', () => {
    // Test with simple strings
    expect(cn('class1', 'class2')).toBe('class1 class2');
    
    // Test with conditional classes
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
    
    // Test with undefined values
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
    
    // Test with array of classes
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
    
    // Test with object notation
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
    
    // Test with complex combination
    const variant: string = 'primary';
    const isActive = true;
    expect(
      cn(
        'base-class',
        variant === 'primary' && 'primary-class',
        variant === 'secondary' && 'secondary-class',
        isActive && 'active-class'
      )
    ).toBe('base-class primary-class active-class');
  });
});

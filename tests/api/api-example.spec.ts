import { test, expect } from '@playwright/test';

const userEmail = process.env.USER_EMAIL!;
const userPassword = process.env.USER_PASSWORD!;

interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: object;
}

function isValidProduct(obj: unknown): obj is Product {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;

  return (
    typeof o.id === 'number' &&
    typeof o.name === 'string' &&
    typeof o.price === 'string' &&
    typeof o.brand === 'string' &&
    typeof o.category === 'object'
  );
}

function validProductListResponse(response: unknown): string[] {
  const errors: string[] = [];

  if (!Array.isArray(response)) {
    errors.push('Response is not an array');
    return errors;
  }

  response.forEach((item, index) => {
    if (!isValidProduct(item)) errors.push(`Item ${index} is invalid`);
  });

  return errors;
}

test('Verify api Products List', async ({ request }) => {
  const res = await test.step('When call api get all products list', async () => {
    return await request.get('/api/productsList');
  });

  const productsData = await res.json();
  const products = await productsData.products;

  await test.step('Then api response with Status Codes 200', async () => {
    expect(productsData.responseCode).toEqual(200);
  });

  await test.step('And api response with full product information', async () => {
    const errors = validProductListResponse(products);
    expect(errors, `Validation failed:\n${errors.join('\n')}`).toHaveLength(0);
  });
});

test('Verify api Login with valid detail', async ({ request }) => {
  const payload = await test.step('Given prepare login with valid detail', async () => {
    return { email: userEmail, password: userPassword };
  });

  const res = await test.step('When call api Login with valid detail', async () => {
    return await request.post('/api/verifyLogin', {
      params: payload,
    });
  });

  const data = await res.json();

  await test.step('Then api response with Status Codes 400', async () => {
    expect(data.responseCode).toEqual(400);
  });

  await test.step('And api response with correct error message', async () => {
    expect(data.message).toEqual('Bad request, email or password parameter is missing in POST request.');
  });
});

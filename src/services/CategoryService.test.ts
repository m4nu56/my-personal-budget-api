import faker from 'faker';
import { Container } from 'typedi';
import LoggerInstance from '../loaders/logger';
import CategoryService from './CategoryService';

Container.set('logger', LoggerInstance);

async function createCategory(name = faker.lorem.words(3), parentId?: number) {
  const categoryService = Container.get(CategoryService);
  return categoryService.create({
    name: name,
    parentId: parentId,
  });
}

describe('CategoryService', () => {
  test('get all categories', async () => {
    await createCategory();
    const categories = await Container.get(CategoryService).getCategories();
    expect(categories.length > 0).toBeTruthy();
  });

  test('get existing category by id', async () => {
    const c = await createCategory();
    const category = await Container.get(CategoryService).getCategoryById(c.id);
    expect(category).not.toBeNull();
  });

  test('get non-existing category by id should return null', async () => {
    const category = await Container.get(CategoryService).getCategoryById(0);
    expect(category).toBeNull();
  });

  test('creates a new category', async () => {
    const name = faker.lorem.words(3);
    const category = await createCategory(name);
    expect(category.name).toEqual(name);
  });

  test('creates a new category with parentId', async () => {
    const categoryParent = await createCategory();
    const category = await createCategory(faker.lorem.words(3), categoryParent.id);
    expect(category.parentId).toEqual(categoryParent.id);
  });

  test('updates a category name', async () => {
    const name = faker.lorem.words(3);
    const category = await createCategory(name);
    category.name = `${name} *`;
    const c2 = await Container.get(CategoryService).update(category.id, category);
    expect(c2.name).toEqual(`${name} *`);
  });

  test('updates a category parentId', async () => {
    const categoryA = await createCategory();
    const categoryB = await createCategory();
    const category = await Container.get(CategoryService).update(categoryA.id, {
      name: categoryA.name,
      parentId: categoryB.id,
    });
    expect(category.parentId).toEqual(categoryB.id);
  });

  test('deletes a category', async () => {
    const category = await createCategory();
    await Container.get(CategoryService).delete(category.id);
    setTimeout(async () => {
      const cDeleted = await Container.get(CategoryService).getCategoryById(category.id);
      expect(cDeleted).toBeNull();
    }, 1000);
  });
});

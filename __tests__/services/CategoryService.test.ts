import faker from 'faker';
import { Container } from 'typedi';
import LoggerInstance from '../../src/loaders/logger';
import CategoryService from '../../src/services/CategoryService';

Container.set('logger', LoggerInstance);

export async function createCategory(name = faker.lorem.words(3), parentId?: number) {
  const categoryService = Container.get(CategoryService);
  return categoryService.create({
    name: name,
    parentId: parentId,
  });
}

describe('CategoryService', () => {
  test('get all categories', async () => {
    await createCategory();
    const paginatedResult = await Container.get(CategoryService).getCategories();
    const categories = paginatedResult.data;
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

  test('findCategoryByName with exact name', async () => {
    const name = faker.lorem.words(3);
    const category = await createCategory(name);
    let c = await Container.get(CategoryService).findCategoryByName(name);
    expect(c.id).toEqual(category.id);
  });

  test('findCategoryByName with same name bad case sensitive', async () => {
    const name = faker.lorem.words(3);
    const category = await createCategory(name);
    let c = await Container.get(CategoryService).findCategoryByName(name.toUpperCase());
    expect(c.id).toEqual(category.id);
  });

  test('findCategoryByName with name not found should return null', async () => {
    let category = await Container.get(CategoryService).findCategoryByName('do not exists');
    expect(category).toBeNull();
  });

  test('findCategoryByNameOrCreate with name not found should create a new category with this name', async () => {
    const name = faker.lorem.words(3);
    let category = await Container.get(CategoryService).findCategoryByNameOrCreate(name);
    expect(category).not.toBeNull();
    expect(category.name).toEqual(name);
  });
});

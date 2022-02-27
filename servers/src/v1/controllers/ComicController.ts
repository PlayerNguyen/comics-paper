import { Tables } from "./../Database";
import { ComicInterface } from "../interfaces/ComicInterface";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import { v4 as uuid } from "uuid";
import validator from "validator";
import slugify from "slugify";

/**
 * Create a new comic into database.
 *
 * @param name a name of a comic
 * @param description a description of a comic
 * @param postedBy a user id who uploaded this comic
 * @returns
 */
async function createComic(
    name: string,
    description: string,
    postedBy: string,
    author: string,
    category: string,
    tags,
    thumbnail?: string
): Promise<ComicInterface> {
    const id = uuid();
    const comic: ComicInterface = {
        id,
        name,
        description,
        postedBy,
        thumbnail,
        createdAt: new Date(),
        updatedAt: new Date(),
        slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
        likes: 0,
        views: 0,
        author,
        category,
    };
    const transaction = await DatabaseBuilder.transaction();
    try {
        await transaction(Tables.Comic).insert(comic);
        const insertTags = tags.map((_tag) => ({ comicId: id, tagId: _tag }));
        await transaction(Tables.ComicBookTag).insert(insertTags);
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
    return comic;
}

/**
 *  Retrieves a comic by using it id
 * @param id a comic id
 * @returns the comic.
 *
 */
async function getAllComics(): Promise<ComicInterface[]> {
    const fields = {
        id: "t1.id",
        thumbnail: "t2.id",
        thumbnailImg: "t2.fileName",
        name: "t1.name",
        description: "t1.description",
        author: "t1.author",
        likes: "t1.likes",
        views: "t1.views",
        slug: "t1.slug",
        category: "t1.category",
        updatedAt: "t1.updatedAt",
        createdAt: "t1.createdAt",
        postedBy: "t1.postedBy",
        tags: DatabaseBuilder.raw(
            "(SELECT GROUP_CONCAT(t3.tagId SEPARATOR ',') FROM comic_book_tags t3 WHERE t3.comicId = t1.id)"
        ),
    };
    const comics: ComicInterface[] = await DatabaseBuilder(`${Tables.Comic} AS t1`)
        .join(`${Tables.Resource} AS t2`, "t1.thumbnail", "t2.id")
        .columns(fields);
    return comics;
}

/**
 *  Retrieves a comic by using it id
 * @param id a comic id
 * @returns the comic.
 *
 */
async function getComic(id: string): Promise<ComicInterface> {
    // check parameters
    if (!id || !validator.isUUID(id)) {
        throw new Error("id is required");
    }
    // Retrieve comic
    const comic = await DatabaseBuilder(Tables.Comic).where({ id }).first();
    const thumbnailInfo = await DatabaseBuilder(Tables.Resource)
        .where({ id: comic.thumbnail })
        .first();
    const tags = await DatabaseBuilder(`${Tables.ComicBookTag} AS t1`)
        .join(`${Tables.ComicTag} AS t2`, "t1.tagId", "t2.id")
        .where({ "t1.comicId": id })
        .columns({ id: "t1.tagId", keyword: "t2.keyword" });
    return { ...comic, thumbnailImg: thumbnailInfo.fileName, tags };
}

/**
 * Update a new comic by it id.
 *
 * @param id a comic id
 * @param name a name of a comic
 * @param description a description of comic
 */
async function updateComic(
    id: string,
    name: string,
    description: string,
    author: string,
    category: string,
    tags,
    thumbnail?: string
) {
    // check parameters
    if (!id || !validator.isUUID(id)) {
        throw new Error("id is required");
    }
    const transaction = await DatabaseBuilder.transaction();
    try {
        await transaction(Tables.Comic)
            .where({ id })
            .update({
                name,
                description,
                updatedAt: new Date(),
                slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
                author,
                category,
                thumbnail,
            });
        const insertTags = tags.map((_tag) => ({ comicId: id, tagId: _tag }));
        await transaction(Tables.ComicBookTag).insert(insertTags);
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
    // Retrieve comic
}

/**
 * Remove a comic by its id.
 * @param id a comic id to delete
 */
async function deleteComic(id: string) {
    // check parameters
    if (!id || !validator.isUUID(id)) {
        throw new Error("id is required");
    }

    // Retrieve comic
    await DatabaseBuilder(Tables.Comic).where({ id }).del();
}

/**
 * Increase the number of views of a comic by 1.
 * @param id identify of the comic
 */
async function updateViewComic(id: string) {
    // check parameters
    if (!id || !validator.isUUID(id)) {
        throw new Error("id is required");
    }
    // Retrieve comic
    await DatabaseBuilder(Tables.Comic)
        .where({ id })
        .update({
            views: DatabaseBuilder.raw("views + 1"),
        });
}

/**
 * Check the comic existence.
 * @param id a comic id
 * @returns true if the comic exists, false otherwise.
 */
async function hasComic(id: string) {
    // check parameters
    if (!id || !validator.isUUID(id)) {
        throw new Error("id is required");
    }
    // Retrieve comic
    const comic = await DatabaseBuilder(Tables.Comic).where({ id }).first();
    return !!comic;
}

/**
 * Search a comic
 */
async function searchComic(query) {
    let { slug, id } = query;

    // Empty the slug unless is filled
    if (slug === undefined) {
        slug = "";
    }

    // Empty the id unless is filled
    if (id === undefined) {
        id = "";
    }
    console.log(slug, id);
    const comic = await DatabaseBuilder(Tables.Comic).where({ slug }).orWhere({ id }).first();
    // console.log(comic);
    return comic;
}

const ComicController = {
    createComic,
    getAllComics,
    getComic,
    updateComic,
    deleteComic,
    updateViewComic,
    hasComic,
    searchComic,
};
export default ComicController;

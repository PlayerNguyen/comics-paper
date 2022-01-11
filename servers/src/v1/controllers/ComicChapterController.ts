import { Tables } from "./../Database";
import { ComicChapterInterface } from "./../interfaces/ComicChapterInterface";
import { ComicChapterViewTypeEnum } from "../interfaces/ComicChapterInterface";
import validator from "validator";
import { v4 as uuid } from "uuid";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 * Create new comic chapter.
 *
 * @param id a identifier of the chapter
 * @param name a name of the chapter
 * @param comicId a identifier of the comic
 * @param postedBy a user who posted the chapter
 * @param viewType a type of the chapter
 * @returns an interface after created
 */
async function createChapter(
  name: string,
  comicId: string,
  postedBy: string,
  viewType: number
): Promise<ComicChapterInterface> {
  // Field check
  if (!name || !comicId || !postedBy) {
    throw new Error("Missing parameters");
  }

  // Comic id and posted by must be uuid
  if (!validator.isUUID(comicId)) {
    throw new Error("Comic id must be a uuid");
  }
  // Check posted user
  if (!validator.isUUID(postedBy)) {
    throw new Error("Posted by must be a uuid");
  }

  const chapter: ComicChapterInterface = {
    id: uuid(),
    name,
    comicId,
    postedBy,
    viewType,
    createdAt: new Date(),
    updatedAt: new Date(),
    length: 0, // always 0
  };

  await DatabaseBuilder(Tables.ComicChapter).insert(chapter);
  return chapter;
}

/**
 *
 * @param comicId a identifier of the comic
 *
 */
async function getChaptersFromComic(
  comicId: string,
  filter?: {
    limit?: number;
    page?: number;
    sortedBy?: string;
    order?: "asc" | "desc";
  }
): Promise<ComicChapterInterface[]> {
  // check parameters
  if (!comicId || !validator.isUUID(comicId)) {
    throw new Error("id is required");
  }
  // Retrieve comic
  const chapter = await DatabaseBuilder(Tables.ComicChapter)
    .where({ comicId })
    .limit(filter?.limit || 3)
    .offset(filter?.page * filter?.limit || 0)
    .orderBy(filter?.sortedBy || "createdAt", filter?.order || "asc");

  return chapter;
}

/**
 * Retrieves the chapter.
 *
 * @param id a identifier of the chapter
 * @returns  the first chapter that having the id
 */
async function getChapter(id: string): Promise<ComicChapterInterface> {
  // check parameters
  if (!id || !validator.isUUID(id)) {
    throw new Error("id is required");
  }
  // Retrieve comic
  const chapter = await DatabaseBuilder(Tables.ComicChapter)
    .where({ id })
    .first();
  return chapter;
}

/**
 * Update chapter length.
 *
 * @param chapterId a identifier of the chapter
 * @param length a block length of this chapter
 */
async function updateChapterLength(chapterId: string, length: number) {
  if (!chapterId || !validator.isUUID(chapterId)) {
    throw new Error("id is required");
  }
  await DatabaseBuilder(Tables.ComicChapter)
    .where({ id: chapterId })
    .update({ length });
}

const ComicChapterController = {
  createChapter,
  getChaptersFromComic,
  getChapter,
  updateChapterLength,
};

export default ComicChapterController;
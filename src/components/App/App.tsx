import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

import css from "./App.module.css";

import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBox from "../SearchBox/SearchBox";
import { Toaster } from "react-hot-toast";

const PER_PAGE = 12;

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const updateQuery = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  }, 1000);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", query, page],
    queryFn: () =>
      fetchNotes({
        search: query.trim() || undefined,
        page,
        perPage: PER_PAGE,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseModal = () => setIsCreateModalOpen(false);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={updateQuery} />

          {isSuccess && totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              page={page}
              onPageChange={setPage}
            />
          )}

          <button className={css.button} type="button" onClick={handleOpenCreateModal}>
            Create note +
          </button>
        </header>

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {isSuccess && notes.length === 0 && query.trim() !== "" && (
          <p>No matches for your query</p>
        )}

        {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
      </div>

      {isCreateModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}

      <Toaster position="top-right" />
    </>
  );
}
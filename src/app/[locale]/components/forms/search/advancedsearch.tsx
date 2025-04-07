/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  search: z.string().optional(),
  sortorder: z.enum(["asc", "desc"]),
  sortby: z.enum(["postId", "title"]),
});

type SearchFormData = z.infer<typeof schema>;

export default function AdvancedSearch({ isSearchEnabled, pageIndex, pageSize }: any) {
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: searchParams.get("search") ?? "",
      sortorder: (searchParams.get("sortorder") as "asc" | "desc") ?? "asc",
      sortby: (searchParams.get("sortby") as "postId" | "title") ?? "postId",
    },
  });

  const onSubmit = (data: SearchFormData) => {
    const url = new URL(window.location.href);
    url.searchParams.set("search", data.search ?? "");
    url.searchParams.set("sortorder", data.sortorder);
    url.searchParams.set("sortby", data.sortby);
    window.history.pushState({}, '', url.toString());

    const sparams = isSearchEnabled
      ? `&sortBy=${data.sortby}&sortOrder=${data.sortorder}&search=${data.search ?? ""}`
      : "";

    const dparams = `?page=${pageIndex}&pageSize=${pageSize}${sparams}`;
    return dparams;
  };

  const resetSearch = () => {
    reset({
      search: "",
      sortorder: "asc",
      sortby: "postId",
    });

    const url = new URL(window.location.href);
    url.searchParams.set("search", "");
    url.searchParams.set("sortorder", "asc");
    url.searchParams.set("sortby", "postId");
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="col-12 mt-3 mx-auto text-center">
      <form className="d-flex align-items-center flex-column" onSubmit={handleSubmit(onSubmit)}>
        <p>Advanced filter search:</p>

        <div className="form-group mt-3">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            {...register("search")}
            className="form-control search mt-3"
            placeholder="Search"
          />
          {errors.search && <small className="text-danger">{errors.search.message}</small>}
        </div>

        <div className="col-12">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group mt-3">
                <label htmlFor="sortorder">Order by</label>
                <select
                  id="sortorder"
                  {...register("sortorder")}
                  className="form-select sortorder mt-3"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                {errors.sortorder && (
                  <small className="text-danger">{errors.sortorder.message}</small>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group mt-3">
                <label htmlFor="sortby">Sort by</label>
                <select
                  id="sortby"
                  {...register("sortby")}
                  className="form-select sortby mt-3"
                >
                  <option value="postId">Post Id</option>
                  <option value="title">Title</option>
                </select>
                {errors.sortby && (
                  <small className="text-danger">{errors.sortby.message}</small>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-group mt-3">
          <button type="button" className="btn btn-primary btn-rounded btnreset" onClick={resetSearch}>
            Reset
          </button>
          <button type="submit" className="btn btn-primary btn-rounded btnsub ms-3">
            <i className="bi bi-search"></i>
            <span className="ms-2">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}

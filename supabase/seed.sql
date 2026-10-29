-- Dates relative to the reset day, so the site always shows a past, a current and upcoming stays.
insert into public.bookings (name, start_date, end_date) values
  ('Lou et Benji', current_date - 20, current_date - 13),
  ('Claire', current_date - 2, current_date + 3),
  ('Lucas', current_date + 10, current_date + 11),
  ('Famille Martin', current_date + 30, current_date + 44);

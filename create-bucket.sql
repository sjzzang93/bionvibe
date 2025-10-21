-- Supabase Storage 버킷 생성
insert into storage.buckets (id, name, public)
values ('app-images', 'app-images', true);

-- 공개 읽기 정책
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'app-images' );

-- 인증된 사용자 업로드 정책
create policy "Authenticated users can upload"
on storage.objects for insert
with check ( bucket_id = 'app-images' );

create user 'server' identified with mysql_native_password by 'pa55word';

grant all privileges on doodletunes.* to 'server';

flush privileges;
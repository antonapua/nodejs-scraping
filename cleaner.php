<?php
  $data = file_get_contents('scrapes/dns.json');
  $json = json_decode($data,true);

  $cleanArr = array('title,content');
  foreach ($json as $key => $value) {
    $title = $value['title'];
    $video_src = str_replace('../tutorials', '', $value['video_src']);

    array_push($cleanArr, $title.','."/videos".$video_src);
  }
  // echo "<pre>";
  // print_r($cleanArr);
  // echo "</pre>";

  header('Content-Type: application/excel');
  header('Content-Disposition: attachment; filename="dns.csv"');
  $fp = fopen('php://output', 'w');
  foreach ( $cleanArr as $line ) {
      $val = explode(",", $line);
      fputcsv($fp, $val);
  }
  fclose($fp);
 ?>
